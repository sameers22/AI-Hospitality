const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { Configuration, OpenAIApi } = require('openai');

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

// OpenAI configuration
const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

// Create a new order via AI chat function calling
app.post('/api/:subdomain/order', async (req, res) => {
  try {
    const { subdomain } = req.params;
    const { messages } = req.body; // Expect chat messages

    const restaurant = await prisma.restaurant.findUnique({ where: { subdomain } });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

    const functions = [
      {
        name: 'create_order',
        description: 'Create an order from parsed user request',
        parameters: {
          type: 'object',
          properties: {
            tableNumber: { type: 'integer', description: 'Table number' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  menuItemId: { type: 'integer' },
                  quantity: { type: 'integer' }
                },
                required: ['menuItemId', 'quantity']
              }
            }
          },
          required: ['tableNumber', 'items']
        }
      }
    ];

    const completion = await openai.createChatCompletion({
      model: 'gpt-4-0613',
      messages,
      functions
    });

    const funcCall = completion.data.choices[0].message?.function_call;
    if (!funcCall || funcCall.name !== 'create_order') {
      return res.status(400).json({ error: 'AI failed to create order' });
    }

    const args = JSON.parse(funcCall.arguments || '{}');

    const order = await prisma.order.create({
      data: {
        tableNumber: args.tableNumber,
        restaurantId: restaurant.id,
        items: {
          create: args.items.map(item => ({ menuItemId: item.menuItemId, quantity: item.quantity }))
        }
      },
      include: { items: { include: { menuItem: true } } }
    });

    res.json(order);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch orders for kitchen app
app.get('/api/:subdomain/orders', async (req, res) => {
  try {
    const { subdomain } = req.params;
    const restaurant = await prisma.restaurant.findUnique({
      where: { subdomain },
      include: {
        orders: {
          include: { items: { include: { menuItem: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
    res.json(restaurant.orders);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API listening on port ${PORT}`));

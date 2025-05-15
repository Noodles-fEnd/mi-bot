const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const TOKEN = process.env.DISCORD_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`Bot conectado como ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const prefix = '=';
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // Helper para mostrar cotización
  async function sendCotizacion(url, title, nombreField, compraField, ventaField, message) {
    try {
      const response = await axios.get(url);
      const data = response.data;
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(title)
        .addFields(
          { name: nombreField, value: data.nombre || title },
          { name: 'Compra', value: `$${data.compra || '-'}` },
          { name: 'Venta', value: `$${data.venta || '-'}` }
        );
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error al obtener cotización:', error);
      message.reply('Hubo un error al obtener la cotización.');
    }
  }

  if (command === 'dolaroficial') {
    sendCotizacion('https://dolarapi.com/v1/dolares/oficial', 'Dólar Oficial', 'Tipo', 'Compra', 'Venta', message);
  } else if (command === 'dolarblue') {
    sendCotizacion('https://dolarapi.com/v1/dolares/blue', 'Dólar Blue', 'Tipo', 'Compra', 'Venta', message);
  } else if (command === 'dolarbolsa') {
    sendCotizacion('https://dolarapi.com/v1/dolares/bolsa', 'Dólar Bolsa', 'Tipo', 'Compra', 'Venta', message);
  } else if (command === 'dolarccl') {
    sendCotizacion('https://dolarapi.com/v1/dolares/ccl', 'Dólar CCL', 'Tipo', 'Compra', 'Venta', message);
  } else if (command === 'dolartarjeta') {
    sendCotizacion('https://dolarapi.com/v1/dolares/tarjeta', 'Dólar Tarjeta', 'Tipo', 'Compra', 'Venta', message);
  } else if (command === 'dolarmayorista') {
    sendCotizacion('https://dolarapi.com/v1/dolares/mayorista', 'Dólar Mayorista', 'Tipo', 'Compra', 'Venta', message);
  } else if (command === 'dolarcripto') {
    sendCotizacion('https://dolarapi.com/v1/dolares/cripto', 'Dólar Cripto', 'Tipo', 'Compra', 'Venta', message);
  } else if (command === 'euro') {
    sendCotizacion('https://dolarapi.com/v1/cotizaciones/eur', 'Euro', 'Moneda', 'Compra', 'Venta', message);
  } else if (command === 'real') {
    sendCotizacion('https://dolarapi.com/v1/cotizaciones/brl', 'Real Brasileño', 'Moneda', 'Compra', 'Venta', message);
  } else if (command === 'pesochileno') {
    sendCotizacion('https://dolarapi.com/v1/cotizaciones/clp', 'Peso Chileno', 'Moneda', 'Compra', 'Venta', message);
  } else if (command === 'pesouruguayo') {
    sendCotizacion('https://dolarapi.com/v1/cotizaciones/uyu', 'Peso Uruguayo', 'Moneda', 'Compra', 'Venta', message);
  } else if (command === 'help' || command === 'ayuda') {
    const helpEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Comandos Disponibles')
      .setDescription('Lista de comandos que puedes usar:')
      .addFields(
        { name: '!dolaroficial', value: 'Cotización del Dólar Oficial' },
        { name: '!dolarblue', value: 'Cotización del Dólar Blue' },
        { name: '!dolarbolsa', value: 'Cotización del Dólar Bolsa' },
        { name: '!dolarccl', value: 'Cotización del Dólar CCL' },
        { name: '!dolartarjeta', value: 'Cotización del Dólar Tarjeta' },
        { name: '!dolarmayorista', value: 'Cotización del Dólar Mayorista' },
        { name: '!dolarcripto', value: 'Cotización del Dólar Cripto' },
        { name: '!euro', value: 'Cotización del Euro' },
        { name: '!real', value: 'Cotización del Real Brasileño' },
        { name: '!pesochileno', value: 'Cotización del Peso Chileno' },
        { name: '!pesouruguayo', value: 'Cotización del Peso Uruguayo' }
      );
    message.channel.send({ embeds: [helpEmbed] });
    return;
  }
});

app.get('/', (req, res) => {
  res.send('Bot de Discord corriendo!');
});

app.listen(PORT, () => {
  console.log(`Servidor HTTP escuchando en el puerto ${PORT}`);
});

client.login(TOKEN);

import dotenv from 'dotenv';

dotenv.config();

const token = process.env.BOT_TOKEN;
export default async function sendRes_telegram(chatId: string, responseText: string) {
  console.log('sendRes_telegram',chatId,responseText);
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId, // Send to the chat ID
      text: responseText, // Response text
      }),
    });
    const data = await response.json();
    console.log('data',data);
    return true;
  } catch (error) {
    console.error('Error sending message:', error);
    return false;
  }
}

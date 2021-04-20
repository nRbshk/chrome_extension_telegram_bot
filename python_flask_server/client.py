from telethon import TelegramClient
from helpers import get_config
from asyncio import get_event_loop

async def start(params: dict):
    config = get_config()
    api_id, api_hash, bot_name = config['api_id'], config['api_hash'], config['bot_name']

    client = TelegramClient('telethon_send_message', api_id, api_hash)

    await client.start()

    prepared_message = f"{params['cmd']} {params['name']} {params['episode']} {params['dub_or_sub']} {params['page']}"
    
    await client.send_message(bot_name, prepared_message)

    await client.disconnect()

    return "OK"


async def first_run():
    config = get_config()
    api_id, api_hash = config['api_id'], config['api_hash']

    client = TelegramClient('telethon_send_message', api_id, api_hash)

    await client.start()

    await client.disconnect()


if __name__ == '__main__':

    loop = get_event_loop()
    

    loop.run_until_complete(first_run())



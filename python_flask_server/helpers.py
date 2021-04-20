def get_config(fn: str = "api.ccfg") -> dict: # short for api.client config
    data = open(fn, 'r').readlines()

    config = dict.fromkeys(['api_id', 'api_hash', 'bot_name'])

    config['api_id'] = data[0].split("=")[1]
    config['api_hash'] = str(data[1].strip("\n").split("=")[1])
    config['bot_name'] = str(data[2].strip("\n").split("=")[1])

    return config

    

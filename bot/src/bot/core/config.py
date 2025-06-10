from pathlib import Path

import yaml


def load_config() -> tuple:
    with Path("config.yaml").open() as file:
        config = yaml.safe_load(file)

        starters = config["starters"]
        chat_settings = config["chat"]["settings"]
        for chat_setting in chat_settings:
            chat_settings[chat_setting]["id"] = chat_setting

    return starters, chat_settings


starters, chat_settings = load_config()

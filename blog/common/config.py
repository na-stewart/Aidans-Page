from os import environ

from sanic.utils import str_to_bool

DEFAULT_CONFIG = {
    "DATABASE_URL": "sqlite://:memory:",
}


class Config(dict):
    DATABASE_URL: str
    SMTP_USERNAME: str
    SMTP_PASSWORD: str

    def load_environment_variables(self, load_env="BLOG_") -> None:
        """
        Any environment variables defined with the prefix argument will be applied to the config.
        Args:
            load_env (str): Prefix being used to apply environment variables into the config.
        """
        for key, value in environ.items():
            if not key.startswith(load_env):
                continue

            _, config_key = key.split(load_env, 1)

            for converter in (int, float, str_to_bool, str):
                try:
                    self[config_key] = converter(value)
                    break
                except ValueError:
                    pass

    def __init__(self):
        super().__init__(DEFAULT_CONFIG)
        self.__dict__ = self
        self.load_environment_variables()


config = Config()

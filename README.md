# wildcard-ai

**TO DO
A brief description of wildcard-ai and it's features.

## Table of Contents

- [Installation](#installation)

## Installation

1. Open terminal

2. Clone the repository:
   ```bash
   git clone https://github.com/chaz-frank/wildcard-ai

3. cd into root folder of project
    ```bash
    cd wildcard-ai

4. Install the dependencies:
    ```bash
    npm install

5. Create .env file in root folder of project:
    ```bash
    touch .env

6. Create a new notion workspace

7. Create an internal notion integration
    https://www.notion.so/profile/integrations

    1. Click + New integration.
    2. Enter the integration name and select the newly created workspace for the new integration.
    3. Get your API secret
        API requests require an API secret to be successfully authenticated. Visit the Configuration tab to get your integration’s API secret (or “Internal Integration Secret”).
    4. Navigate back to terminal
        ```bash
        echo NOTION_KEY="API KEY HERE" > .env
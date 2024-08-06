# wildcard-ai

**TO DO
A brief description of wildcard-ai and it's features.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)

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
    4. Navigate back to terminal and add api key to .env file. Don't include the "".
        ```bash
        echo NOTION_KEY="API KEY HERE" > .env

8. Create a page in your notion workspace and grab the id. Quickest way is to grab the url and find the id in it.
    - Example:
        https://www.notion.so/378ea15987e241889b919db8c9b52efa?v=017216ad91d842e
        The id is everything after the last slash, so this one is 378ea15987e241889b919db8c9b52efa?v=017216ad91d842e

9. Add page id to .env file. Don't include the "".
    ```bash
    echo NOTION_PAGE_ID="PAGE ID HERE" > .env


9. Get an openai api key and load some credits for testing.

10. Add openai api key to .env file. Don't include the "".
    ```bash
    echo OPENAI_API_KEY="API KEY HERE" > .env

## Usage
- Navigate to terminal and open the root file of the project. If you just finished installation, then you're already in the root file.
```bash
npx next dev
```
- Go to your preferred web browser (Chrome is the best one) and go to localhost:3000.
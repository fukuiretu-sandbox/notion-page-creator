const { Client } = require("@notionhq/client");
require("dotenv").config();

const PAGE_TITLE = "New Page with Content";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

/**
 * ページを作成する関数
 * @param {string} title ページのタイトル
 * @param {string} status ステータス
 * @param {string[]} tags タグ
 * @returns {Promise<string>} ページのID
 */
async function createPage(title, status, tags) {
    try {
        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                "名前": {
                    title: [{ text: { content: title } }],
                },
                Status: {
                    status: {
                        name: status
                    }
                },
                Tags: {
                    multi_select: tags.map(tag => ({ name: tag }))
                }
            },
        });
        console.log("Page created with ID:", response.id);

        return response.id;
    } catch (error) {
        console.error("Error creating page:", error.message);
        throw error;
    }
}

/**
 * ページにコンテンツを追加する関数
 * @param {string} pageId ページのID
 * @param {object[]} content コンテンツ
 * @returns {Promise<void>}
 */
async function addContentToPage(pageId, content) {
    try {
        const response = await notion.blocks.children.append({
            block_id: pageId,
            children: content,
        });
        console.log("Content added successfully");
        
        return response;
    } catch (error) {
        console.error("Error adding content:", error.message);
        throw error;
    }
}

/**
 * メイン処理を行う関数
 * @returns {Promise<void>}
 */
async function main() {
    try {
        const pageId = await createPage(PAGE_TITLE, "進行中", ["タグ1", "タグ2"]);
        const content = [
            {
                object: "block",
                type: "heading_2",
                heading_2: {
                    rich_text: [{ type: "text", text: { content: "ソース" } }],
                },
            },
            {
                object: "block",
                type: "bookmark",
                bookmark: {
                    url: "https://example.com"
                },
            },
        ];
        await addContentToPage(pageId, content);
    } catch (error) {
        console.error("Failed to create page with content:", error.message);
    }
}

main();

const AWS = require('aws-sdk');
const { Request, Response } = require('@softchef/lambda-events');

exports.handler = async (e) => {
    const req = new Request(e);
    const res = new Response();

    try {
        const db = new AWS.DynamoDB.DocumentClient();

        await db.put({
            TableName: 'items',
            Item: { itemId: req.input('id'), itemName: req.input('itemName') }
        }).promise();

        return res.json({
            created: true
        });
    } catch (e) {
        return res.error(e);
    }
};
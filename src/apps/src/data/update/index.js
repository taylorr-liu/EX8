const AWS = require('aws-sdk');
const { Request, Response } = require('@softchef/lambda-events');

exports.handler = async (e) => {
    const req = new Request(e);
    const res = new Response();

    try {
        const db = new AWS.DynamoDB.DocumentClient();

        const data = await db.update({
            TableName: 'items',
            Key: {
                itemId: req.parameter('id')
            },
            UpdateExpression: 'set itemName = :itemName',
            ExpressionAttributeValues: {
                ':itemName': req.input('itemName')
            }
        }).promise();
        if (!data) {
            return res.error('Not found', 404);
        }
        return res.json({ updated: true });
    } catch (e) {
        return res.error(e);
    }
};
const AWS = require('aws-sdk');
const { Request, Response } = require('@softchef/lambda-events');

exports.handler = async (e) => {
    const req = new Request(e);
    const res = new Response();

    try {
        const db = new AWS.DynamoDB.DocumentClient();

        const data = await db.get({
            TableName: 'items',
            Key: {
                itemId: req.parameter('id')
            }
        }).promise();
        if (!data) {
            return res.json(data);
        }
        return res.json(data);
    } catch (e) {
        return res.error(e);
    }
};
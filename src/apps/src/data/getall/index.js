const AWS = require('aws-sdk');
const { Request, Response } = require('@softchef/lambda-events');

exports.handler = async (e) => {
    const req = new Request(e);
    const res = new Response();

    try {
        const db = new AWS.DynamoDB.DocumentClient();

        const data = await db.scan({
            TableName: 'items'
        }).promise();
        if (!data) {
            return res.error('Not found', 404);
        }
        return res.json(data);
    } catch (e) {
        return res.error(e);
    }
};
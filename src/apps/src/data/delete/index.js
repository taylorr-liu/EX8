const AWS = require('aws-sdk');
const { Request, Response } = require('@softchef/lambda-events');

exports.handler = async (e) => {
    const req = new Request(e);
    const res = new Response();

    try {
        const db = new AWS.DynamoDB.DocumentClient();

        await db.delete({
            TableName: 'items',
            Key: { itemId: req.parameter('id') }
        }).promise();

        return res.json({
            deleted: true
        });
    } catch (e) {
        return res.error(e);
    }
};
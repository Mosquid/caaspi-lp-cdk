const AWS = require("aws-sdk")
const db = new AWS.DynamoDB.DocumentClient()
const TABLE_NAME = process.env.TABLE_NAME
const PRIMARY_KEY = process.env.PRIMARY_KEY || ""

module.exports.create = async (data) => {
  try {
    const resp = await db
      .put({
        TableName: TABLE_NAME,
        Item: {
          [PRIMARY_KEY]: data.id,
          ...data,
        },
      })
      .promise()

    return resp
  } catch (error) {
    console.log(error)
    return false
  }
}

import AWS from 'aws-sdk'
AWS.config.update({ region: 'eu-central-1' })

const dynamodb = new AWS.DynamoDB.DocumentClient()
const dynamodbTableName = 'validation'
const healthCheckPath = './health'
const emplPath = './empl'
const emplsPath = './empls'

exports.handler = async (event: {
  httpMethod: string
  path: string
  queryStringParameters: { id: any }
  body: string
}) => {
  console.log('Request event: ', event)
  let response
  switch (true) {
    case event.httpMethod === 'GET' && event.path === healthCheckPath:
      response = buildResponse(200)
      break
    case event.httpMethod === 'GET' && event.path === emplPath:
      response = await getEmployee(event.queryStringParameters.id)
      break
    case event.httpMethod === 'GET' && event.path === emplsPath:
      response = await getEmployees()
      break
    case event.httpMethod === 'POST' && event.path === emplPath:
      response = await addEmployee(JSON.parse(event.body))
      break
    case event.httpMethod === 'PATCH' && event.path === emplPath:
      // eslint-disable-next-line no-case-declarations
      const requestBody = JSON.parse(event.body)
      response = await updateEmployee(
        requestBody.id,
        requestBody.updateKey,
        requestBody.updateValue
      )
      break
    case event.httpMethod === 'DELETE' && event.path === emplPath:
      response = await deleteEmployee(JSON.parse(requestBody).id)
      break
  }
  return response
}

async function getEmployee(id: any) {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      id: id
    }
  }
  return await dynamodb
    .get(params)
    .promise()
    .then(
      response => {
        return buildResponse(200, response.Item)
      },
      error => {
        console.error('Error handling log: ', error)
      }
    )
}

async function getEmployees() {
  const params = {
    TableName: dynamodbTableName
  }
  const allEmployees = await scanDynamoRecords(params, [])
  const body = {
    products: allEmployees
  }
  return buildResponse(200, body)
}

async function scanDynamoRecords(
  scanParams: AWS.DynamoDB.DocumentClient.ScanInput,
  itemArray: any[]
): Promise<any> {
  try {
    const dynamoData = await dynamodb.scan(scanParams).promise()
    itemArray = itemArray.concat(dynamoData.Items)
    if (dynamoData.LastEvaluatedKey) {
      scanParams.ExclusiveStartKey = dynamoData.LastEvaluatedKey
      return await scanDynamoRecords(scanParams, itemArray)
    }
    return itemArray
  } catch (error) {
    console.error('Error handling log: ', error)
  }
}

async function addEmployee(requestBody: any) {
  const params = {
    TableName: dynamodbTableName,
    Item: requestBody
  }
  return await dynamodb
    .put(params)
    .promise()
    .then(
      () => {
        const body = {
          Operation: 'ADD',
          Message: 'SUCCESS',
          Item: requestBody
        }
        return buildResponse(200, body)
      },
      error => {
        console.error('Error handling log: ', error)
      }
    )
}

async function updateEmployee(id: any, updateKey: any, updateValue: any) {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      id: id
    },
    UpdateExpression: `set ${updateKey} = :value`,
    ExpressionAttributeValues: {
      ':value': updateValue
    },
    ReturnValues: 'UPDATED_NEW'
  }
  return await dynamodb
    .update(params)
    .promise()
    .then(
      response => {
        const body = {
          Operation: 'UPDATE',
          Message: 'SUCCESS',
          UpdatedAttributes: response
        }
        return buildResponse(200, body)
      },
      error => {
        console.error('Error handling log: ', error)
      }
    )
}

async function deleteEmployee(id: any) {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      id: id
    },
    ReturnValues: 'ALL_OLD'
  }
  return await dynamodb
    .delete(params)
    .promise()
    .then(
      response => {
        const body = {
          Operation: 'DELETE',
          Message: 'SUCCESS',
          Item: response
        }
        return buildResponse(200, body)
      },
      error => {
        console.error('Error handling log: ', error)
      }
    )
}

function buildResponse(
  statusCode: number,
  body?: AWS.DynamoDB.DocumentClient.AttributeMap | undefined
) {
  return {
    statusCode: statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
}

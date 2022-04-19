import express from 'express'
import AWS from 'aws-sdk'

AWS.config.update({ region: 'eu-central-1' })

const router = express.Router()

const dynamodb = new AWS.DynamoDB.DocumentClient()

const dynamodbTableName = 'validation-employees'

// Note: purpose of using async below is that DynamoDB funcations are all async

// get one employee
router.get('/', async (req: express.Request, res: express.Response) => {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      id: req.query.id
    }
  }
  await dynamodb
    .get(params)
    .promise()
    .then(
      response => {
        res.json(response.Item)
      },
      error => {
        console.error('Error handling log: ', error)
        res.status(500).send(error)
      }
    )
})

// get all employees
// NOTE: custom function scanDynamoRecords implemented to ensure all records returned recursively
// FIXME: issue with res type whe set to Respond
router.get('/all', async (req: express.Request, res: express.Response) => {
  const params = {
    TableName: dynamodbTableName
  }
  try {
    const allEmployees = await scanDynamoRecords(params, [])
    const body = {
      employees: allEmployees
    }
    res.json(body)
  } catch (error) {
    console.error('Error handling log: ', error)
    res.status(500).send(error)
  }
})

// add one employee
router.post('/', async (req: express.Request, res: express.Response) => {
  const params = {
    TableName: dynamodbTableName,
    Item: req.body
  }
  await dynamodb
    .put(params)
    .promise()
    .then(
      () => {
        const body = {
          Operation: 'SAVE',
          Message: 'SUCCESS',
          Item: req.body
        }
        res.json(body)
      },
      error => {
        console.error('Error handling log: ', error)
        res.status(500).send(error)
      }
    )
})

// update an employee
router.patch('/', async (req: express.Request, res: express.Response) => {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      id: req.body.id
    },
    UpdateExpression: `set ${req.body.updateKey} = :value`,
    ExpressionAttributeValues: {
      ':value': req.body.updateValue
    },
    ReturnValues: 'UPDATED_NEW'
  }
  await dynamodb
    .update(params)
    .promise()
    .then(
      response => {
        const body = {
          Operation: 'UPDATE',
          Message: 'SUCCESS',
          UpdatedAttributes: response
        }
        res.json(body)
      },
      error => {
        console.error('Error handling log: ', error)
        res.status(500).send(error)
      }
    )
})

// delete an employee
router.delete('/', async (req: express.Request, res: express.Response) => {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      id: req.body.id
    },
    ReturnValues: 'ALL_OLD'
  }
  await dynamodb
    .delete(params)
    .promise()
    .then(
      response => {
        const body = {
          Operation: 'DELETE',
          Message: 'SUCCESS',
          Item: response
        }
        res.json(body)
      },
      error => {
        console.error('Error handling log: ', error)
        res.status(500).send(error)
      }
    )
})

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

export default router

module.exports = {
  up: (dynamodb) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
      return dynamodb.put({ TableName, Item }).promise();
    */
      return dynamodb.put({ TableName: 'kvp-table-brandbcleantempthree', Item: {entityId: 'helloworld', key:'helloworld'} }).promise();
  },

  down: (dynamodb) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
      return dynamodb.delete({ TableName, Key }).promise();
    */
      return dynamodb.delete({ TableName: 'kvp-table-brandbcleantempthree', Key: {entityId: 'helloworld', key:'helloworld'} }).promise();
  }
};

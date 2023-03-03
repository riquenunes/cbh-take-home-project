const crypto = require("crypto");

const stringify = (input) => {
  if (typeof input !== "string") return JSON.stringify(input);

  return input;
};

const createHash = (input) => {
  const stringifiedInput = stringify(input);

  return crypto.createHash("sha3-512").update(stringifiedInput).digest("hex");
};

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;

  if (!event) return TRIVIAL_PARTITION_KEY;
  if (!event.partitionKey) return createHash(event);

  const stringifiedPartitionKey = stringify(event.partitionKey);

  if (stringifiedPartitionKey.length > MAX_PARTITION_KEY_LENGTH) {
    return createHash(stringifiedPartitionKey);
  }

  return stringifiedPartitionKey;
};

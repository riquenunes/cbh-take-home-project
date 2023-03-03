const { deterministicPartitionKey } = require("./dpk.js");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns the literal '0' when given a falsy input", () => {
    expect(deterministicPartitionKey(0)).toBe("0");
    expect(deterministicPartitionKey("")).toBe("0");
  });

  it("Returns the same event partition key when given an event with a partition key with less than 256 characters", () => {
    const partitionKey = deterministicPartitionKey({ partitionKey: "abc" });

    expect(partitionKey).toBe("abc");
  });

  it("Returns a hashed partition key when given an event with a partition key that exceeds 256 characters", () => {
    const partitionKey = deterministicPartitionKey({
      partitionKey: "a".repeat(257),
    });

    expect(partitionKey).toBe(
      "5008048b64c14975181175f157be4a780c3d443d2177edf323d57884bc7e3979b9b53bca1325e880df3da0d97c435693441cb5527fbe950f5585678dfbb37785"
    );
  });

  it("Returns a stringified partition key when given an event with a partition key that is not a string", () => {
    const firstPartitionKey = deterministicPartitionKey({
      partitionKey: 123,
    });

    const secondPartitionKey = deterministicPartitionKey({
      partitionKey: { foo: "bar" },
    });

    expect(firstPartitionKey).toBe("123");
    expect(secondPartitionKey).toBe('{"foo":"bar"}'); // probably not an ideal key, but this is the current behavior
  });

  it("Returns a hash of the event object when given an event with no partition key", () => {
    const partitionKey = deterministicPartitionKey({ foo: "bar" });

    expect(partitionKey).toBe(
      "a419a15de4a65c3dba49c38b4485cd4dce1dde4d18f5b965d90f0649bef54252ec4e76dbcaa603708e8e8ebbe848ba484e81e23b7823808b5b8e5f4222d122e8"
    );
  });

  it("Returns a hash of the event object when given an event with a falsy partition key", () => {
    const firstEvent = { partitionKey: 0 };
    const secondEvent = { partitionKey: "" };

    expect(deterministicPartitionKey(firstEvent)).toBe(
      "e65a0cb83a95cae7eb0642da576cac881e397c0405c63577c977068f7892f69f1c315baa294124da2a67e0c486d340f9d357377f894d0c0fd850484f8984f2e7"
    );
    expect(deterministicPartitionKey(secondEvent)).toBe(
      "b7478342a465088fc33d43a64cd370737e5a3bf6749ca62c1d6db341beb987326b4df3a9f54f67a2f0ee915d4216af2f382fda14dd58dc67794f745e92d7a7f6"
    );
  });
});

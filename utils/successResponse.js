class SuccessResponse {
  constructor(message = "success", data = []) {
    this.message = message;
    this.status = true;
    this.data = data;
  }
}

module.exports = { SuccessResponse };

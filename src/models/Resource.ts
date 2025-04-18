export class Resource {
  id: string;
  topicId: string;
  url: string;
  description: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: Resource) {
    this.id = params.id;
    this.topicId = params.topicId;
    this.url = params.url;
    this.description = params.description;
    this.type = params.type;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
}

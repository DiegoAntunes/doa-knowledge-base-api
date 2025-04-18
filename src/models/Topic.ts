  export class Topic {
    id: string;
    name: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    version: number;
    parentTopicId?: string;
  
    constructor(params: Topic) {
      this.id = params.id;
      this.name = params.name;
      this.content = params.content;
      this.createdAt = params.createdAt;
      this.updatedAt = params.updatedAt;
      this.version = params.version;
      this.parentTopicId = params.parentTopicId;
    }
  }
  
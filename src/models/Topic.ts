export interface ITopic {
    id: string;
    name: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    version: number;
    parentTopicId?: string;
  }
  
  export class Topic implements ITopic {
    id: string;
    name: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    version: number;
    parentTopicId?: string;
  
    constructor(params: ITopic) {
      this.id = params.id;
      this.name = params.name;
      this.content = params.content;
      this.createdAt = params.createdAt;
      this.updatedAt = params.updatedAt;
      this.version = params.version;
      this.parentTopicId = params.parentTopicId;
    }
  }
  
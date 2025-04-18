export type ResourceType = 'video' | 'article' | 'pdf';

export interface IResource {
  id: string;
  topicId: string;
  url: string;
  description: string;
  type: ResourceType;
  createdAt: Date;
  updatedAt: Date;
}

export class Resource implements IResource {
  id: string;
  topicId: string;
  url: string;
  description: string;
  type: ResourceType;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: IResource) {
    this.id = params.id;
    this.topicId = params.topicId;
    this.url = params.url;
    this.description = params.description;
    this.type = params.type;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
}

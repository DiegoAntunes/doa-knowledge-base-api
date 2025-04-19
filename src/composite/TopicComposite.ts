import { ITopicComponent } from './ITopicComponent';
import { ITopic } from '../models/Topic';

export class TopicComposite implements ITopicComponent {
  private children: ITopicComponent[] = [];

  constructor(private topic: ITopic) {}

  getId(): string {
    return this.topic.id;
  }

  getName(): string {
    return this.topic.name;
  }

  getChildren(): ITopicComponent[] {
    return this.children;
  }

  addChild(child: ITopicComponent): void {
    this.children.push(child);
  }

  toJSON(): any {
    return {
      ...this.topic,
      children: this.children.map(child => child.toJSON())
    };
  }
}

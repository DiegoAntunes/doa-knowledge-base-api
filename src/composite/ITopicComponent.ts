export interface ITopicComponent {
    getId(): string;
    getName(): string;
    getChildren(): ITopicComponent[];
    addChild(child: ITopicComponent): void;
    toJSON(): any; // To facilitate tree serialization
  }
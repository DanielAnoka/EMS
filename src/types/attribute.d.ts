export interface Attribute {
    id: number,
    name:string,
    label:string,
    createdAt:string,
    updatedAt:string
}

export interface CreatePropertyAttributePayload {
  name: string;
  label: string;
};
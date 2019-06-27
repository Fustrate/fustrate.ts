export default class FormDataBuilder {
    static build(obj: {
        [s: string]: any;
    }, namespace?: string): FormData;
    private static appendObjectToFormData;
    private static toFormData;
}

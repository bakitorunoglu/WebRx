/// <reference path="../Interfaces.d.ts" />
export default class RadioGroupComponent implements wx.IComponentDescriptor {
    constructor(htmlTemplateEngine: wx.ITemplateEngine);
    template: (params: any) => Node[];
    viewModel: (params: any) => any;
    htmlTemplateEngine: wx.ITemplateEngine;
    protected buildTemplate(params: wx.IRadioGroupComponentParams): Node[];
}

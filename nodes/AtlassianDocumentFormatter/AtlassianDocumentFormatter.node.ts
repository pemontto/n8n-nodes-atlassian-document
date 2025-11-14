import type {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	INodeProperties,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import * as operations from './operations';

// Common properties shared between versions
const commonProperties: INodeProperties[] = [
	{
		displayName: 'Input Data',
		name: 'input',
		type: 'json',
		default: '',
		required: true,
		description: 'The data to be converted to ADF or from ADF',
	},
	{
		displayName: 'Destination Key',
		name: 'destinationKey',
		type: 'string',
		default: 'data',
		required: true,
		placeholder: 'data',
		description: 'The field to put the output in',
	},
	{
		displayName: 'Include Other Input Fields',
		name: 'includeOtherFields',
		type: 'boolean',
		default: true,
		description:
			'Whether to pass to the output all the input fields (along with the converted data)',
	},
];

// Version 1: Uses 'mode' parameter
const modeProperty: INodeProperties = {
	displayName: 'Mode',
	name: 'mode',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			'@version': [1],
		},
	},
	options: [
		{
			name: 'Wiki Markup to ADF',
			value: 'wikiMarkupToADF',
			description: 'Convert data from Wiki Markup to ADF',
		},
		{
			name: 'ADF to Wiki Markup',
			value: 'ADFToWikiMarkup',
			description: 'Convert data from ADF to Wiki Markup',
		},
		{
			name: 'Markdown to ADF',
			value: 'markdownToADF',
			description: 'Convert data from Markdown to ADF',
		},
	],
	default: 'wikiMarkupToADF',
};

// Version 2: Uses 'operation' parameter
const operationProperty: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			'@version': [2],
		},
	},
	options: [
		{
			name: 'Wiki Markup to ADF',
			value: 'wikiMarkupToADF',
			action: 'Convert wiki markup to atlassian document format',
			description: 'Convert data from Wiki Markup to ADF',
		},
		{
			name: 'ADF to Wiki Markup',
			value: 'ADFToWikiMarkup',
			action: 'Convert atlassian document format to wiki markup',
			description: 'Convert data from ADF to Wiki Markup',
		},
		{
			name: 'Markdown to ADF',
			value: 'markdownToADF',
			action: 'Convert markdown to atlassian document format',
			description: 'Convert data from Markdown to ADF',
		},
	],
	default: 'wikiMarkupToADF',
};

export class AtlassianDocumentFormatter implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Atlassian Document Formatter',
		name: 'atlassianDocumentFormatter',
		icon: 'file:../../icons/atlassian.svg',
		group: ['transform'],
		version: [1, 2],
		subtitle: '={{$parameter["operation"] || $parameter["mode"]}}',
		description: 'Converts to and from Atlassian Document Format (ADF)',
		defaults: {
			name: 'ADF',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		properties: [modeProperty, operationProperty, ...commonProperties],
	};

	methods = {
		loadOptions: operations.loadOptionsFunctions,
	};

	async execute(this: IExecuteFunctions) {
		return operations.execute.call(this);
	}
}

import type {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import * as operations from './operations';

export class AtlassianDocumentFormatter implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Atlassian Document Formatter',
		name: 'atlassianDocumentFormatter',
		icon: 'file:../../icons/atlassian.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Converts to and from Atlassian Document Format (ADF)',
		defaults: {
			name: 'ADF',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
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
			},
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
		],
	};

	methods = {
		loadOptions: operations.loadOptionsFunctions,
	};

	async execute(this: IExecuteFunctions) {
		return operations.execute.call(this);
	}
}

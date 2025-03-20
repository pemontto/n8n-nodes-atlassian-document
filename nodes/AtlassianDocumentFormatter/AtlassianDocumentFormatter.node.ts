import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { WikiMarkupTransformer } from '@atlaskit/editor-wikimarkup-transformer';
import { MarkdownTransformer } from '@atlaskit/editor-markdown-transformer';
import { JSONDocNode, JSONTransformer } from '@atlaskit/editor-json-transformer';

export class AtlassianDocumentFormatter implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Atlassian Document Formatter',
		name: 'atlassianDocumentFormatter',
		icon: 'file:atlaskit-logo.svg',
		group: ['transform'],
		version: 1,
		description: 'Converts to and from Atlassian Document Format (ADF)',
		defaults: {
			name: 'ADF',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Mode',
				name: 'mode',
				type: 'options',
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
					// This is not implemented yet in the underlying library
					// {
					// 	name: 'Wiki ADF to Markdown',
					// 	value: 'ADFToMarkdown',
					// 	description: 'Convert data from ADF to Markdown',
					// },
				],
				default: 'wikiMarkupToADF',
			},
			{
				displayName: 'Input Data',
				name: 'input',
				type: 'json',
				default: {},
				required: true,
				description: 'The data to be converted to ADF or from ADF',
			},
			{
				displayName: 'Destination Key',
				name: 'destinationKey',
				type: 'string',
				default: 'data',
				required: true,
				placeholder: '',
				description: 'The field to put the output in',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let returnData: INodeExecutionData[] = [];

		const mode = this.getNodeParameter('mode', 0) as string;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const destinationKey = this.getNodeParameter('destinationKey', itemIndex) as string;
				let transformer;
				let out;

				let input = this.getNodeParameter('input', itemIndex) as string;

				if (mode === 'ADFToWikiMarkup') {
					// Convert string to JSON Object
					if (typeof input === 'string') {
						input = JSON.parse(input);
					}
					const JSONtransformer = new JSONTransformer();
					transformer = new WikiMarkupTransformer();
					const adf = JSONtransformer.parse(input as unknown as JSONDocNode);
					out = transformer.encode(adf);
				}
				if (mode === 'markdownToADF') {
					transformer = new MarkdownTransformer();
					out = transformer.parse(input as string).toJSON();
					out = JSON.stringify(out);
				}
				if (mode === 'wikiMarkupToADF') {
					transformer = new WikiMarkupTransformer();
					out = transformer.parse(input as string).toJSON();
					out = JSON.stringify(out);
				}
				// const executionData = this.helpers.constructExecutionMetaData(
				// 	this.helpers.returnJsonArray({
				// 		item,
				// 		[destinationKey]: out
				// 	}),
				// 	{ itemData: { item: itemIndex } },
				// );
				// returnData = returnData.concat(executionData);
				returnData = returnData.concat({
					json: { ...items[itemIndex].json, [destinationKey]: out },
					pairedItem: itemIndex,
				});
			} catch (error) {
				// This node should never fail but we want to showcase how
				// to handle errors.
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					// Adding `itemIndex` allows other workflows to handle this error
					if (error.context) {
						// If the error thrown already contains the context property,
						// only append the itemIndex
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return [returnData];
	}
}

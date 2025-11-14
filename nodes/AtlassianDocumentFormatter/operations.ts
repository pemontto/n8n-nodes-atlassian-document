import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { WikiMarkupTransformer } from '@atlaskit/editor-wikimarkup-transformer';
import { MarkdownTransformer } from '@atlaskit/editor-markdown-transformer';
import { JSONDocNode, JSONTransformer } from '@atlaskit/editor-json-transformer';
import { removeLocalIds } from './GenericFunctions';

export const loadOptionsFunctions = {};

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];
	// Backwards compatibility: support both 'operation' (new) and 'mode' (old) parameter names
	let operation: string;
	try {
		operation = this.getNodeParameter('operation', 0) as string;
	} catch {
		// Fall back to old 'mode' parameter for backwards compatibility
		operation = this.getNodeParameter('mode', 0) as string;
	}

	for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
		const includeOtherFields = this.getNodeParameter(
			'includeOtherFields',
			itemIndex,
			true,
		) as boolean;

		try {
			const destinationKey = this.getNodeParameter('destinationKey', itemIndex) as string;
			let out: string;

			const input = this.getNodeParameter('input', itemIndex) as string;

			if (operation === 'ADFToWikiMarkup') {
				// Convert string to JSON Object
				let parsedInput = input;
				if (typeof input === 'string') {
					parsedInput = JSON.parse(input);
				}
				const jsonTransformer = new JSONTransformer();
				const transformer = new WikiMarkupTransformer();
				const adf = jsonTransformer.parse(parsedInput as unknown as JSONDocNode);
				out = transformer.encode(adf);
			} else if (operation === 'markdownToADF') {
				const transformer = new MarkdownTransformer();
				let adf = transformer.parse(input as string).toJSON();
				adf = removeLocalIds(adf);
				adf = { version: 1, ...adf };
				out = JSON.stringify(adf);
			} else if (operation === 'wikiMarkupToADF') {
				if (typeof input !== 'string') {
					throw new NodeOperationError(
						this.getNode(),
						'Input Data must be a Wiki Markup string',
						{ itemIndex },
					);
				}
				const transformer = new WikiMarkupTransformer();
				let adf = transformer.parse(input as string).toJSON();
				adf = removeLocalIds(adf);
				adf = { version: 1, ...adf };
				out = JSON.stringify(adf);
			} else {
				throw new NodeOperationError(
					this.getNode(),
					`Unknown operation: ${operation}`,
					{ itemIndex },
				);
			}

			if (includeOtherFields) {
				returnData.push({
					json: { ...items[itemIndex].json, [destinationKey]: out },
					pairedItem: itemIndex,
				});
			} else {
				returnData.push({
					json: { [destinationKey]: out },
					pairedItem: itemIndex,
				});
			}
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: this.getInputData(itemIndex)[0].json,
					error,
					pairedItem: itemIndex,
				});
			} else {
				if (error.context) {
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

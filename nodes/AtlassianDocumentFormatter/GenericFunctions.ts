// Helper function to recursively remove 'localId' and '__confluenceMetadata' from 'attrs' objects,
// omit the 'attrs' key if it becomes empty.
export function removeLocalIds(node: unknown): unknown {
	if (Array.isArray(node)) {
		return node.map(removeLocalIds);
	}

	if (node !== null && typeof node === 'object') {
		const nodeRecord = node as Record<string, unknown>;
		const newNode: Record<string, unknown> = {};
		for (const key in nodeRecord) {
			if (key === 'attrs' && nodeRecord[key] && typeof nodeRecord[key] === 'object') {
				// Clone attrs object
				const newAttrs: Record<string, unknown> = { ...nodeRecord[key] as Record<string, unknown> };
				// Delete localId if it exists
				if ('localId' in newAttrs) {
					delete newAttrs.localId;
				}
				// Remove __confluenceMetadata
				if ('__confluenceMetadata' in newAttrs) {
					delete newAttrs.__confluenceMetadata;
				}
				// Only add the 'attrs' key back if it still contains other properties
				if (Object.keys(newAttrs).length > 0) {
					newNode[key] = newAttrs;
				}
				// Otherwise, omit the 'attrs' key entirely
			} else {
				// Recursively process other properties/nested nodes
				newNode[key] = removeLocalIds(nodeRecord[key]);
			}
		}
		return newNode;
	}

	return node; // Return primitives directly
}

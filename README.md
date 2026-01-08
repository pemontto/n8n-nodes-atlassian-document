<img src="https://raw.githubusercontent.com/pemontto/n8n-nodes-atlassian-document/master/icons/atlassian.svg" width="120" alt="Atlassian Logo" />

# n8n-nodes-atlassian-document

This is an n8n community node. It lets you convert between Atlassian Document Format (ADF), Wiki Markup, and Markdown in your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

The Atlassian Document Formatter node supports the following operations:

- **Wiki Markup to ADF**: Convert Jira/Confluence Wiki Markup to Atlassian Document Format
- **ADF to Wiki Markup**: Convert Atlassian Document Format to Wiki Markup
- **Markdown to ADF**: Convert Markdown to Atlassian Document Format

### What is Atlassian Document Format (ADF)?

Atlassian Document Format (ADF) is a JSON-based document representation format used by Atlassian products like Jira and Confluence. It provides a structured way to represent rich text content including:

- Formatted text (bold, italic, etc.)
- Lists (ordered and unordered)
- Tables
- Code blocks
- Links and media
- And more

This node is useful when you need to:
- Create or update Jira issues with formatted descriptions
- Convert content between different formats for Confluence pages
- Transform markdown documentation into ADF for Atlassian products
- Process Wiki Markup content from legacy Jira/Confluence instances

## Configuration

The node requires the following parameters:

- **Operation**: Select the conversion type
- **Input Data**: The source data to convert (can be a string or JSON)
- **Destination Key**: The field name where the converted output will be stored (default: "data")
- **Include Other Input Fields**: Whether to include all input fields in the output along with the converted data (default: true)

## Credentials

This node does not require any credentials. It performs local transformations using Atlassian's official transformation libraries.

## Compatibility

Compatible with n8n@1.60.0 or later

## Usage

### Example: Convert Wiki Markup to ADF

1. Add the Atlassian Document Formatter node to your workflow
2. Select "Wiki Markup to ADF" as the operation
3. Provide Wiki Markup text in the Input Data field
4. The node will output valid ADF JSON that can be used with Jira/Confluence APIs

### Example: Convert Markdown to ADF for Jira

1. Add the Atlassian Document Formatter node after a node that outputs Markdown
2. Select "Markdown to ADF" as the operation
3. Reference the markdown field in Input Data (e.g., `{{$json["markdown"]}}`)
4. Use the output in a Jira node to create or update issues with formatted content

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Atlassian Document Format](https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/)
* [Jira Cloud REST API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/)
* [Confluence Cloud REST API](https://developer.atlassian.com/cloud/confluence/rest/v2/intro/)

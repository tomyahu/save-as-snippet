# save-as-snippet
Adds the `save-as-snippet.save-to-snippet-file` commmand, which can be called by opening the command pallette (with F1) and searching for "Save selected text as a Snippet".
The command copies the selected text in a file and takes you through the flow of saving it to a snippet file:

1. It asks you what the prefix will be (its recommended that all your snippets start with the same prefix for easy access)
1. It asks you waht snippet file to save it to
	* *If you cancel or create a new snippet file during this flow, then the snippet will not be saved*

The extension will add a uuid as the key for your new snippet.
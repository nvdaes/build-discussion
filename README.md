# Build discussion action #

This action creates a GitHub discussion.

It's inspired by the [Create GitHub discussion action](https://github.com/marketplace/actions/create-github-discussion), by @abirismyname.

## Inputs ##

### `repository` ###

The repository where the discussion should be created. Default `${{ github.repository }}`.

### `token` ###

GitHub token. Default `${{ github.token }}`.

### `category-position` ###

The position of the category for the discussion, starting with 1 for the first available category. Default `1`.

### `title` ###

Discussion title. Default `Discussion created with Build discussion action`.

### `body` ###

Discussion body. Default `This is the discussion body`.

## Outputs ##

### `discussion-id` ###

Discussion ID.

### `discussion-url` ###

Discussion URL.

### `discussion-number` ###

Discussion number.

## Example usage ##

```yaml
- name: Build discussion
  id: build-discussion
  uses: nvdaes/build-discussion@v1
  with:
    repository: owner/repo
	   category-position: 1
	   title: My GitHub discussion
	   body: |
	     My body.
		    Can be multiline.

- name: Print Output
  id: output
  run: |
    echo "${{ steps.build-discussion.outputs.discussion-id }}"
    echo "${{ steps.build-discussion.outputs.discussion-url }}"
    echo "${{ steps.build-discussion.outputs.discussion-number }}"
```

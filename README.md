# json-converter
Convert table to json on Airtable Extensions

<img width="2959" alt="Image" src="https://github.com/user-attachments/assets/d936b86c-b17d-4b5b-a2a6-64933e9ed1cf" />

## Requirements

- Node
  - [@airtable/blocks-cli](https://www.npmjs.com/package/@airtable/blocks-cli)
- AirTable
  - Invitation of Base collaborators `evala×ICC×サウンド・アート年表` in `NTTICC` workspace

## How to

### Setup

#### Install dependencies

```shell
npm install
```

#### Personal access token

1. Go to `Builder Hub > Developers > Personal access tokens` on Airtable.
2. Select `json-converter_202502` .
3. Add base for access.

##### (re-set token to local)

1. ( regenerate token if needed. )
2. `block set-api-key` to set token.
3. `cat ~/.config/.airtableblocksrc.json`

#### Table view

- Add a view named `出力用` to make the table columns the output target.

### Develop

```shell
block run
```

then

1. Find AirTable APPS `json-converter` and select `Edit app`
2. Enter `https://localhost:9000` at App URL in Edit app window

### Release

```shell
block release
```

### Arrange output to publish

1. Copy json from output of `json-converter` on Airtable extension window.
2. Devide arrays as categories.

- e.g. 
   - sound-art.json
   - icc.json
   - evala-parsonal.json
   - evala-collaboration.json
   - evala-composition.json
   - evala-others.json
   - technology.json

## Misc

### References

- [AirTable Developers](https://www.airtable.com/developers)
- [Beta: Run in multiple bases - Airtable Blocks SDK](https://airtable.com/developers/extensions/guides/run-in-multiple-bases)

## Notes

### Contributors

- [Tomoya KASHIMADA](https://github.com/tomoya-ntticc)
export default [
  {
    key: 'id',
    types: ['string', 'number'],
    required: true,
  },
  {
    key: 'suggestions',
    types: ['object'],
    required: false,
  },
  {
    key: 'user',
    types: ['boolean'],
    required: true,
  },
  {
    key: 'trigger',
    types: ['string', 'number', 'function'],
    required: false,
  },
  {
    key: 'validator',
    types: ['function'],
    required: false,
  },
  {
    key: 'end',
    types: ['boolean'],
    required: false,
  },
  {
    key: 'inputAttributes',
    types: ['object'],
    required: false,
  },
  {
    key: 'metadata',
    types: ['object'],
    required: false,
  },
  {
    key: 'keywords',
    types: ['object'],
    required: false,
  },
];

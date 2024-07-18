export default [
    {
      key: 'id',
      types: ['string', 'number'],
      required: true,
    },
    {
      key: 'event',
      types: ['any'],
      required: true,
    },
    {
      key: 'avatar',
      types: ['string'],
      required: false,
    },
    {
      key: 'replace',
      types: ['boolean'],
      required: false,
    },
    {
      key: 'waitAction',
      types: ['any'],
      required: false,
    },
    {
      key: 'asMessage',
      types: ['boolean'],
      required: false,
    },
    {
      key: 'trigger',
      types: ['string', 'number', 'function'],
      required: false,
    },
    {
      key: 'delay',
      types: ['number'],
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
  
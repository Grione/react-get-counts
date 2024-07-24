import { types } from 'mobx-state-tree';

const Area = types.model('Area', {
  id: types.string,
});

const Count = types.model('Count', {
  id: types.identifier,
  _type: types.array(types.string),
  installation_date: types.string,
  is_automatic: types.boolean,
  initial_values: types.array(types.number),
  area: Area,
  description: types.string,
  address: types.optional(types.string, ''),
});

export default Count;

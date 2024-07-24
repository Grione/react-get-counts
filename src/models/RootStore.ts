import { types, flow } from "mobx-state-tree";
import axios from "axios";
import Count from "./Count";

const RootStore = types
  .model('RootStore', {
    counts: types.array(Count),
    total: types.optional(types.number, 0),
    limit: types.optional(types.number, 20),
    offset: types.optional(types.number, 0),
    addresses: types.map(types.string)
  })
  .actions(self => {
    const fetchAddress = flow(function* (areaId: string) {
      try {
        const response = yield axios.get(`http://showroom.eis24.me/api/v4/test/areas/?id=${areaId}`);
        const address = response.data.results[0].house.address + ', ' + response.data.results[0].str_number_full;
        self.addresses.set(areaId, address);

        // Обновляем адреса у счетчиков
        self.counts.forEach(count => {
          if (count.area.id === areaId) {
            count.address = address;
          }
        });
      } catch (error) {
        console.error(`Failed to fetch address for area ${areaId}`, error);
      }
    });

    const fetchCounts = flow(function* (offset = 0) {
      try {
        const response = yield axios.get(`http://showroom.eis24.me/api/v4/test/meters/?limit=${self.limit}&offset=${offset}`);
        self.counts = response.data.results;
        self.total = response.data.count;
        self.offset = offset;

        for (const count of self.counts) {
          if (!self.addresses.has(count.area.id)) {
            yield fetchAddress(count.area.id);
          } else {
            count.address = self.addresses.get(count.area.id) || '';
          }
        }
      } catch (error) {
        console.error("Failed to fetch meters", error);
      }
    });

    const removeCount = flow(function* removeCount(id: string) {
      try {

        yield axios.delete(`http://showroom.eis24.me/api/v4/test/meters/${id}/`)
        yield fetchCounts(self.offset);

      } catch (error) {
        console.error(`Failed to remove meter with id ${id}`, error);
      }
    });

    const setOffsetAndFetch = flow(function* setOffsetAndFetch(newOffset: number) {
      self.offset = newOffset;
      yield fetchCounts(newOffset);
    });

    return { fetchCounts, fetchAddress, setOffsetAndFetch, removeCount }
  })
  .views(self => ({
    get currentPage() {
      return Math.floor(self.offset / self.limit) + 1; // Возвращает текущую страницу на основе offset и limit
    },
    get totalPages() {
      return Math.ceil(self.total / self.limit); // Возвращает общее количество страниц на основе total и limit
    }
  }));

export default RootStore;
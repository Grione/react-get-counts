import { useLocalObservable } from 'mobx-react-lite';
import RootStore from "./models/RootStore";
import { StoreContext } from './stores';
import CountTable from './components/CountTable';
import Pagination from './components/Pagination';

function App() {
  const store = useLocalObservable(() => RootStore.create(
    {
      counts: [],
      total: 0,
      limit: 20,
      offset: 0
    }));

  return <StoreContext.Provider value={store}>
    <CountTable />
    <Pagination />
  </StoreContext.Provider>
}

export default App;

abstract class BaseDataMapper<D, M> {
  M mapToModel(D data);
  D mapToData(M model);
}
export const sortCycleByAssociate = (data) => {
  const associates = {};
  for (const item of data) {
    if (associates[item.Person]) {
      associates[item.Person].push(item);
    } else {
      associates[item.Person] = [item];
    }
  }
  return Object.values(associates);
}
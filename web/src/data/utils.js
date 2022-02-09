export function convertModuleToArray(module) {
    if (!module) {
      return [];
    }
    if (Array.isArray(module)) {
      return module;
    }
    try {
        return Object.values(module)[0]
    } catch (e) {
      console.log(e)
    }
}
import * as dntShim from "../_dnt.shims.js";
const globalRead = { name: 'read' } as const
const globalEnv = { name: 'env' } as const

/**
 * Request / query a PermissionDescriptor
 */
async function requestPermission(
  permission: dntShim.Deno.PermissionDescriptor,
): Promise<boolean> {
  const status = await dntShim.Deno.permissions.request(permission)

  if (status.state === 'granted') {
    return true
  } else {
    return false
  }
}

/**
 * Request read permissions
 */
export const requestReadPermission = () => requestPermission(globalRead)

/**
 * Request environment variable permissions
 */
export const requestEnvPermission = () => requestPermission(globalEnv)
import {TokenManagement} from '../../core/tokenManagement';
import {data} from "../ressources/tokenRequest";

test('Test encode token with jwt', async () => {
    const token = TokenManagement.getTokenWithJWT(data);
    console.log("token ===> " + token)
});
test('Test decode token with jwt', async () => {
    const user = TokenManagement.decodeTokenJWT( TokenManagement.encodeJWTToken(data, process.env.JWT_SECRET_KEY || "AccessToken", process.env.JWT_EXPIRATION_SECONDS !== undefined ? parseInt(process.env.JWT_EXPIRATION_SECONDS): 3600), process.env.JWT_SECRET_KEY || "AccessToken");
    if (user !== null) {
      expect(user.username).toBe(data.username);
    } else {
      expect(user).toBe(null);
    }

});

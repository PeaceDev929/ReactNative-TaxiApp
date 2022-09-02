import jwt from 'jsonwebtoken';
import Res from '../../helpers/responses';
import {
   HTTP_SERVER_ERROR,
   HTTP_CREATED,
   HTTP_OK,
   HTTP_BAD_REQUEST,
   HTTP_NOT_FOUND,
} from '../../core/constants/httpStatus';
import RiderModal from '../../models/rider';
import { isRiderValid } from '../../utils/validator/users';
import createSecret from '../../utils/secretCode';
/**
 * Rider Controller
 */
class RiderController {
   /**
    * Create a user
    * @param {*} req
    * @param {*} res
    * @returns {string|object} user payload
    */
   static async create(req, res) {
      const data = req.body;
      const { error, value } = isRiderValid(data);
      if (error) {
         let errorMessage = error.details[0].message;
         return Res.handleError(HTTP_BAD_REQUEST, `${errorMessage}`, res);
      }
      const { phone_number, date } = data;
      const secret = createSecret();
      let rider = new RiderModal({
         phone_number,
         secret,
         date,
      });
      rider
         .save()
         .then(async (result) => {
            return Res.handleSuccess(
               HTTP_CREATED,
               'RIDER ACCOUNT SUCCESSFULLY CREATED',
               result,
               res,
            );
         })
         .catch((err) => {
            return Res.handleError(HTTP_SERVER_ERROR, err, res);
         });
   }
   /**
    * veriy phone
    * @param {*} req
    * @param {*} res
    * @returns {object}
    */
   static async verifyPhone(req, res) {
      const data = req.body;
      const { phone_number, secret } = data;
      await RiderModal.find({ phone_number })
         .exec()
         .then((user) => {
            if (user === null) {
               if (err) Res.handleError(HTTP_NOT_FOUND, 'NO RIDER FOUND', res);
               return;
            }
            if (user.secret === secret) {
               RiderModal.findOneAndUpdate(
                  { _id: user._id },
                  { activated: true },
                  { new: true },
                  (err, user) => {
                     if (err) {
                        Res.handleError(HTTP_SERVER_ERROR, 'error', res);
                     } else {
                        return Res.handleSuccess(
                           HTTP_OK,
                           'RIDER ACCOUNT SUCCESSFULLY VERIFIED',
                           user,
                           res,
                        );
                     }
                  },
               );
            }
         });
   }
   /**
    * driver login
    * @param {*} req
    * @param {*} res
    * @returns {string|object}
    */
   static async login(req, res) {
      const { phone_number } = req.body;
      await RiderModal.find({ phone_number })
         .exec()
         .then((user) => {
            if (user.length === 0) {
               return Res.handleError(HTTP_NOT_FOUND, 'NO USER FOUND', res);
            } else {
               if (user) {
                  const SECRET_KEY = 'YOUR_SECURE_PASSWORD';
                  const token = jwt.sign(
                     {
                        firstname: user[0].firstname,
                        lastname: user[0].lastname,
                        nationality: user[0].nationality,
                        image: user[0].image,
                        phone_number: user[0].phone_number,
                        email: user[0].email,
                        date: user[0].date,
                     },
                     SECRET_KEY,
                     {
                        expiresIn: '24h',
                     },
                  );
                  return Res.handleSuccess(
                     HTTP_OK,
                     'RIDER SUCCESSFULLY LOGGED IN',
                     token,
                     res,
                  );
               }
               return Res.handleError(HTTP_SERVER_ERROR, 'error', res);
            }
         })
         .catch((err) => Res.handleError(HTTP_SERVER_ERROR, 'error', res));
   }
}

export default RiderController;

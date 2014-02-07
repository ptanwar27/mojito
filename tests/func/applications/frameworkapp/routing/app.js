/*
* Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
* Copyrights licensed under the New BSD License.
* See the accompanying LICENSE file for terms.
*/


/*jslint node:true*/

'use strict';

var debug = require('debug')('app'),
    express = require('express'),
    libmojito = require('../../../../..'),
    app,
    mid;

app = express();
app.set('port', process.env.PORT || 8666);
libmojito.extend(app);

app.use(libmojito.middleware());
app.mojito.attachRoutes();
app.post('/tunnel', libmojito.tunnelMiddleware());


// "_any_mojit_particular_action": {
//     "verbs": ["get"],
//     "path": "/:mojit-id/run_index",
//     "call": "{mojit-id}.index"
// },
app.get('/:mojitId/run_index', libmojito.dispatch('{mojitId}.index'));

// "_any_mojit_action": {
//     "verbs": ["get", "post", "put"],
//     "path": "/:mojit-id/:mojit-action",
//     "call": "{mojit-id}.{mojit-action}"
// }
mid = libmojito.dispatch('{mojitId}.{mojitAction}');
app.get('/:mojitId/:mojitAction', mid);
app.post('/:mojitId/:mojitAction', mid);
app.put('/:mojitId/:mojitAction', mid);

app.get('/status', function (req, res) {
    res.send('200 OK');
});

app.listen(app.get('port'), function () {
    debug('Server listening on port ' + app.get('port') + ' ' +
               'in ' + app.get('env') + ' mode');
});

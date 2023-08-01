import React, { useEffect, useState } from 'react';
import { SettingsSidebar } from '../components/SettingsSidebar';
import PropTypes from 'prop-types';
import { MdVerified, MdDelete } from 'react-icons/md';
import { LiaJava } from 'react-icons/lia';
import getModsListFromAPI, { ModTypes, deleteLocalMod, getModsListFromLocal, importLocalMod, setAllModsEnabled, toggleMod } from '../utils/game/mods-utils';
import * as dialog from 'node-file-dialog';

export function Settings({
    pageComponent
}) {
    return <div className='flex flex-nowrap m-6 ml-10 mt-10 p-6 rounded bg-gray-950 w-full h-auto'>
        <SettingsSidebar />
        {pageComponent}
    </div>;
}
Settings.propTypes = {
    pageComponent: PropTypes.any
};

export function SettingsAccount() {
    return <div>
        
    </div>;
}

export function SettingsMinecraft() {
    return <div>
        
    </div>;
}

export function SettingsJava() {
    return <div>
        
    </div>;
}

export function SettingsMods() {

    const [mods, setMods] = useState([]);
    const [refreshes, setRefreshes] = useState(0);

    useEffect(() => {
        const fetchAllMods = async () => {
            const localModsRes = await getModsListFromLocal();
            getModsListFromAPI()
                .then((remoteModsRes) => {
                    if (!remoteModsRes.success) return;
                    const remoteMods = remoteModsRes.mods;
                    setMods([
                        ...localModsRes,
                        ...remoteMods
                    ]);
                });
        };

        fetchAllMods()
            .catch((err) => {
                console.log(err);
            });
    }, [refreshes]);

    const handleModToggle = (mod) => {
        toggleMod(mod.type, mod.md5);
        const filteredMods = mods.map((newMod) => {
            if (newMod.md5 === mod.md5)
                mod.enabled = !mod.enabled;
            return newMod;
        });
        setMods(filteredMods);
    };

    const handleModDeletion = (mod) => {
        deleteLocalMod(mod);
        const filteredMods = mods.filter((m) => m.md5 !== mod.md5);
        setMods(filteredMods);
    };

    const handleModImport = () => {
        dialog({
            type: 'open-files'
        }).then((files) => {
            files.forEach((file) => {
                importLocalMod(file);
                setRefreshes(refreshes + 1);
            });
        }).catch((err) => {
            console.log(err);
        });
    };

    const handleSetAllModsEnabled = (type, enabled) => {
        setAllModsEnabled(mods, type, enabled);
        const mappedMods = mods.map((m) => {
            if (m.type === type)
                m.enabled = enabled;
            return m;
        });
        setMods(mappedMods);
    };

    const handleRefresh = () => {
        setRefreshes(refreshes + 1);
    };

    return <div className='overflow-y-scroll'>
        <h1 className='text-2xl font-semibold text-white'>Mods <button onClick={handleRefresh} className='rounded text-sm p-1 m-1 bg-blue-600 hover:bg-blue-600 transition-all'>Recharger</button></h1>
        <p className="text-xs text-gray-400 mb-2">Ici vous pouvez gérer les mods optionnels et même ajouter les votres.</p>

        <h2 className='text-xl mt-6 font-semibold'>Mods Personnalisés <button onClick={handleModImport} className='rounded text-sm p-1 m-1 bg-blue-600 hover:bg-blue-600 transition-all'>Importer</button> <button onClick={() => handleSetAllModsEnabled(ModTypes.Local, true)} className='rounded text-sm p-1 m-1 bg-green-500 hover:bg-green-600 transition-all'>Tout activer</button> <button onClick={() => handleSetAllModsEnabled(ModTypes.Local, false)} className='rounded text-sm p-1 m-1 bg-red-500 hover:bg-red-600 transition-all'>Tout désactiver</button></h2>
        <p className="text-xs text-gray-400 mb-2">Nous vous rappeleons que nous ne sommes pas responsables des crash liés aux mods personnalisés et que les mods liés à la triche ne seront pas tolérés.</p>
        <ul className='grid grid-cols-2'>
            {mods.filter((mod) => mod.type === ModTypes.Local).map((mod) => <li className='m-1 p-3 rounded bg-gray-900' key={mod.md5}>
                <div className='w-full flex flex-nowrap items-start justify-between'>
                    <div className='group flex items-center justify-center p-2 rounded bg-blue-500 cursor-pointer hover:bg-red-500 transition-all'>
                        <LiaJava className='text-xl group-hover:hidden' />
                        <MdDelete className='text-xl hidden group-hover:block' onClick={() => handleModDeletion(mod)} />
                    </div>
                    <div className='cursor-pointer relative'>
                        <input type="checkbox" id={mod.md5 + '_input'} checked={mod.enabled} onChange={() => handleModToggle(mod)} className="sr-only peer" />
                        <label htmlFor={mod.md5 + '_input'} className="block w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></label>
                    </div>
                </div>
                <h3 className='text-sm font-semibold mt-4'>{mod.name}&nbsp;<MdVerified className='text-sm text-blue-500 inline'/>&nbsp;<span className='text-xs text-gray-400 inline'>by {mod.author}</span></h3>
            </li>)}
        </ul>

        <h2 className='text-xl mt-6 font-semibold'>Mods Performances <button onClick={() => handleSetAllModsEnabled(ModTypes.Performances, true)} className='rounded text-sm p-1 m-1 bg-green-500 hover:bg-green-600 transition-all'>Tout activer</button> <button onClick={() => handleSetAllModsEnabled(ModTypes.Performances, false)} className='rounded text-sm p-1 m-1 bg-red-500 hover:bg-red-600 transition-all'>Tout désactiver</button></h2>
        <p className="text-xs text-gray-400 mb-2">Ces mods améliorent grandement les performances de votre jeu. Il est vivement déconseillé de les désactiver.</p>
        <ul className='grid grid-cols-2'>
            {mods.filter((mod) => mod.type === ModTypes.Performances).map((mod) => <li className='m-1 p-3 rounded bg-gray-900' key={mod.md5}>
                <div className='w-full flex flex-nowrap items-start justify-between'>
                    <div className='group flex items-center justify-center p-2 rounded bg-blue-500 cursor-pointer'>
                        <LiaJava className='text-xl' />
                    </div>
                    <div className='cursor-pointer relative'>
                        <input id={mod.md5 + '_input'} onChange={() => handleModToggle(mod)} type="checkbox" checked={mod.enabled} className="sr-only peer" />
                        <label htmlFor={mod.md5 + '_input'} className="block w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></label>
                    </div>
                </div>
                <h3 className='text-sm font-semibold mt-4'>{mod.name}&nbsp;<MdVerified className='text-sm text-blue-500 inline'/>&nbsp;<span className='text-xs text-gray-400 inline'>by {mod.author}</span></h3>
            </li>)}
        </ul>

        <h2 className='text-xl mt-6 font-semibold'>Mods Optionnels <button onClick={() => handleSetAllModsEnabled(ModTypes.Optionnal, true)} className='rounded text-sm p-1 m-1 bg-green-500 hover:bg-green-600 transition-all'>Tout activer</button> <button onClick={() => handleSetAllModsEnabled(ModTypes.Optionnal, false)} className='rounded text-sm p-1 m-1 bg-red-500 hover:bg-red-600 transition-all'>Tout désactiver</button></h2>
        <p className="text-xs text-gray-400 mb-2">Ces mods vous donnent une meilleure expérience de jeu ainsi qu&apos;un meilleur confort. Vous pouvez les désactiver pour gagner en performances.</p>
        <ul className='grid grid-cols-2'>
            {mods.filter((mod) => mod.type === ModTypes.Optionnal).map((mod) => <li className='m-1 p-3 rounded bg-gray-900' key={mod.md5}>
                <div className='w-full flex flex-nowrap items-start justify-between'>
                    <div className='group flex items-center justify-center p-2 rounded bg-blue-500 cursor-pointer'>
                        <LiaJava className='text-xl' />
                    </div>
                    <div className='cursor-pointer relative'>
                        <input id={mod.md5 + '_input'} onChange={() => handleModToggle(mod)} type="checkbox" checked={mod.enabled} className="sr-only peer" />
                        <label htmlFor={mod.md5 + '_input'} className="block w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></label>
                    </div>
                </div>
                <h3 className='text-sm font-semibold mt-4'>{mod.name}&nbsp;<MdVerified className='text-sm text-blue-500 inline'/>&nbsp;<span className='text-xs text-gray-400 inline'>by {mod.author}</span></h3>
            </li>)}
        </ul>

        <h2 className='text-xl mt-6 font-semibold'>Mods Requis</h2>
        <p className="text-xs text-gray-400 mb-2">Ces mods sont requis pour se connecter au serveur et ne sont donc pas désactivables.</p>
        <ul className='grid grid-cols-2'>
            {mods.filter((mod) => mod.type === ModTypes.Required).map((mod) => <li className='m-1 p-3 rounded bg-gray-900' key={mod.md5}>
                <div className='w-full flex flex-nowrap items-start justify-between'>
                    <div className='group flex items-center justify-center p-2 rounded bg-blue-500 cursor-pointer'>
                        <LiaJava className='text-xl' />
                    </div>
                </div>
                <h3 className='text-sm font-semibold mt-4'>{mod.name}&nbsp;<MdVerified className='text-sm text-blue-500 inline'/>&nbsp;<span className='text-xs text-gray-400 inline'>by {mod.author}</span></h3>
            </li>)}
        </ul>
    </div>;
}

export function SettingsUpdate() {
    return <div>
        
    </div>;
}